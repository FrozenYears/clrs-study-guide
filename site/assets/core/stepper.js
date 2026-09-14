/* =============================================================================
 * core/stepper.js — 步进引擎（运行时 Agent 拥有，最重要）
 *
 * 接管一个 JS 生成器，每个 `yield` = 一帧。
 *
 * 回退策略：缓存已产生的帧（frames[]）。
 *   理由：CLRS 的算法生成器会就地修改输入数组（如 A[j+1]=A[j]），并靠
 *   `array: A.slice()` 输出快照——这类「有状态」生成器无法简单重放。
 *   缓存帧是通用且零成本的方案（教学动画 n 极小），也让 stepBack / gotoFrame
 *   直接移动索引即可，无需重建状态。
 *
 * 公开 API（createStepper 返回对象）：
 *   play() / pause() / toggle()
 *   step() -> bool          （前进一步；到末尾默认停止）
 *   stepBack() -> bool      （后退一步）
 *   reset()                 （回到第 0 帧并暂停）
 *   setSpeed(ms)
 *   gotoFrame(n)            （跳到指定帧，自动夹紧范围）
 *   onFrame(cb) -> () => void   （注册；注册即回调当前帧）
 *   getState() -> {index, total, playing, speed, done}
 *   destroy()
 *
 * opts：
 *   speed?: number          （毫秒/帧，默认 650）
 *   autoplay?: boolean      （创建后是否自动播放；reduced-motion 下强制不自动）
 *   loop?: boolean          （到末尾再 step 是否回到 0）
 *   total?: number          （已知总帧数提示，用于进度显示）
 *   mount?: HTMLElement     （键盘监听挂载点；必须可聚焦，否则自动加 tabindex）
 *   reducedMotion?: 'auto'|'on'|'off'  （默认 'auto'）
 *   respectReducedMotion?: boolean     （默认 true；false 则忽略系统偏好）
 * ========================================================================== */

const DEFAULT_SPEED = 650;

function systemReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function effectiveReduced(opts) {
  if (opts.respectReducedMotion === false) return false;
  const rm = opts.reducedMotion ?? "auto";
  if (rm === "on") return true;
  if (rm === "off") return false;
  return systemReducedMotion();
}

export function createStepper(generator, opts = {}) {
  if (!generator || typeof generator.next !== "function") {
    throw new Error("[stepper] 需要一个 generator（可调用 .next()）");
  }

  const frames = [];
  let done = false;
  let index = 0;
  let playing = false;
  let speed = opts.speed && opts.speed > 0 ? opts.speed : DEFAULT_SPEED;
  let timer = null;
  const frameCbs = [];
  let keyOff = null;

  function ensure(n) {
    while (!done && frames.length <= n) {
      const r = generator.next();
      if (r.done) {
        done = true;
        break;
      }
      frames.push(r.value);
    }
    return frames[n];
  }

  function runToEnd() {
    while (!done) {
      const r = generator.next();
      if (r.done) {
        done = true;
        break;
      }
      frames.push(r.value);
    }
  }

  function maxIndex() {
    return Math.max(0, frames.length - 1);
  }

  function emit() {
    ensure(index); // 保证当前帧可用
    const frame = frames[index];
    const state = getState();
    frameCbs.forEach((cb) => {
      try {
        cb(frame, state);
      } catch (e) {
        console.error("[stepper] onFrame 回调出错：", e);
      }
    });
  }

  function getState() {
    return {
      index,
      total: opts.total != null ? opts.total : done ? frames.length : null,
      playing,
      speed,
      done,
    };
  }

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function loop() {
    if (!playing) return;
    const more = advance();
    if (more && playing) {
      timer = setTimeout(loop, speed);
    } else {
      playing = false;
      timer = null;
      emit();
    }
  }

  function advance() {
    const atLast = index >= maxIndex() && (done || !ensure(index + 1));
    if (atLast) {
      if (opts.loop) {
        index = 0;
        emit();
        return true;
      }
      playing = false;
      return false;
    }
    index += 1;
    ensure(index);
    emit();
    return true;
  }

  /* ---------- 公开方法 ---------- */
  function play() {
    // reduced-motion 下：默认不自动播放（用户显式点击播放不受影响）
    if (playing) return;
    if (done && !opts.loop) {
      // 已结束则从头开始
      index = 0;
    }
    playing = true;
    emit();
    timer = setTimeout(loop, speed);
  }

  function pause() {
    const wasPlaying = playing;
    playing = false;
    clearTimer();
    // 只在「确实从播放态切走」时才通知，避免 step() 里 pause→advance 造成同一次
    // 单步触发两次 onFrame（会让渲染计数翻倍、动画看起来在抖）。
    if (wasPlaying) emit();
  }

  function toggle() {
    playing ? pause() : play();
  }

  function step() {
    pause();
    const before = index;
    advance();
    return index !== before || !done;
  }

  function stepBack() {
    pause();
    if (index > 0) {
      index -= 1;
      emit();
      return true;
    }
    return false;
  }

  function reset() {
    pause();
    index = 0;
    emit();
  }

  function setSpeed(ms) {
    if (ms && ms > 0) {
      speed = ms;
      if (playing) {
        clearTimer();
        timer = setTimeout(loop, speed);
      }
      emit();
    }
  }

  function gotoFrame(n) {
    pause();
    const target = Number(n);
    if (!Number.isFinite(target)) return;
    ensure(target); // 可能推进生成器
    index = Math.min(Math.max(0, Math.floor(target)), maxIndex());
    emit();
  }

  function onFrame(cb) {
    frameCbs.push(cb);
    // 注册即回调当前帧，便于首屏渲染
    try {
      ensure(index);
      cb(frames[index], getState());
    } catch (e) {
      console.error("[stepper] onFrame 初始回调出错：", e);
    }
    return () => {
      const i = frameCbs.indexOf(cb);
      if (i >= 0) frameCbs.splice(i, 1);
    };
  }

  /* ---------- 键盘（只挂载到 mount，不劫持整页） ---------- */
  function bindKeyboard(mount) {
    if (!mount) return;
    if (!mount.hasAttribute("tabindex")) mount.setAttribute("tabindex", "0");
    mount.setAttribute("role", mount.getAttribute("role") || "group");
    mount.setAttribute("aria-label", mount.getAttribute("aria-label") || "动画步进控制区");
    const handler = (e) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          step();
          break;
        case "ArrowLeft":
          e.preventDefault();
          stepBack();
          break;
        case " ":
        case "Spacebar":
          e.preventDefault();
          toggle();
          break;
        case "Home":
          e.preventDefault();
          gotoFrame(0);
          break;
        case "End":
          e.preventDefault();
          runToEnd();
          gotoFrame(maxIndex());
          break;
        default:
          break;
      }
    };
    mount.addEventListener("keydown", handler);
    keyOff = () => mount.removeEventListener("keydown", handler);
  }

  function destroy() {
    pause();
    if (keyOff) {
      keyOff();
      keyOff = null;
    }
    frameCbs.length = 0;
  }

  /* ---------- 初始化 ---------- */
  ensure(0); // 预拉第一帧
  if (opts.mount) bindKeyboard(opts.mount);
  // autoplay 受 reduced-motion 约束
  if (opts.autoplay && !effectiveReduced(opts)) {
    play();
  }

  return {
    play,
    pause,
    toggle,
    step,
    stepBack,
    reset,
    setSpeed,
    gotoFrame,
    onFrame,
    getState,
    destroy,
  };
}

export default createStepper;
