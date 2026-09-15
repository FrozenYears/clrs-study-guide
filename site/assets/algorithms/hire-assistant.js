// hire-assistant.js -- HIRE-ASSISTANT 的教学帧。
// 候选人的数值就是资格 rank，数值越大表示资格越高；帧内下标保持与原书一致的 1 基。

export function* hireAssistant(ranks, interviewCost = 1, hireCost = 10) {
  const array = ranks.slice();
  const counts = { interview: 0, hire: 0, cost: 0 };
  let best = 0;

  const frame = (line, extra = {}) => ({
    line,
    array: array.slice(),
    pointers: extra.pointers || {},
    highlight: extra.highlight || {},
    note: extra.note || '',
    counts: { ...counts },
    invariantHolds: extra.invariantHolds !== undefined ? extra.invariantHolds : true,
    done: false,
  });

  yield frame(1, {
    note: 'best = 0：虚拟候选人的资格低于所有真实候选人。',
  });

  for (let index = 0; index < array.length; index++) {
    const candidate = index + 1;
    const rank = array[index];
    yield frame(2, {
      pointers: { i: candidate, best: best || candidate },
      highlight: { active: [candidate], visited: best ? [best] : [] },
      note: `开始处理第 ${candidate} 位候选人。`,
    });

    counts.interview++;
    counts.cost += interviewCost;
    yield frame(3, {
      pointers: { i: candidate, best: best || candidate },
      highlight: { active: [candidate], visited: best ? [best] : [] },
      note: `面试候选人 ${candidate}（资格 ${rank}），累计面试 ${counts.interview} 次。`,
    });

    const bestRank = best === 0 ? -Infinity : array[best - 1];
    const improves = rank > bestRank;
    yield frame(4, {
      pointers: { i: candidate, best: best || candidate },
      highlight: { compare: best ? [candidate, best] : [candidate] },
      note: improves
        ? `资格 ${rank} 超过当前最佳资格 ${bestRank === -Infinity ? '虚拟值' : bestRank}。`
        : `资格 ${rank} 不超过当前最佳资格 ${bestRank}，不招聘。`,
    });

    if (improves) {
      best = candidate;
      yield frame(5, {
        pointers: { i: candidate, best },
        highlight: { active: [best] },
        note: `best = ${best}：候选人 ${best} 成为当前最佳。`,
      });
      counts.hire++;
      counts.cost += hireCost;
      yield frame(6, {
        pointers: { i: candidate, best },
        highlight: { result: [best] },
        note: `招聘候选人 ${best}，累计招聘 ${counts.hire} 次。`,
      });
    }
  }

  yield {
    line: null,
    array: array.slice(),
    pointers: best ? { best } : {},
    highlight: best ? { result: [best] } : {},
    counts: { ...counts },
    note: best ? `完成：最终候选人是 ${best}，资格 ${array[best - 1]}。` : '完成：没有候选人。',
    invariantHolds: true,
    done: true,
  };
}
