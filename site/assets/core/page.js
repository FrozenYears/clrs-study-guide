/* =============================================================================
 * core/page.js — 关卡数据里「页码字段」的公共处理
 *
 * 关卡数据的 page 字段有两种形态：整数（22）与区间（[31, 32]），个别还可能是
 * 两页相同的退化写法（[7, 7]）。页码锚出现在原文块、结论表、习题头、术语表、
 * 复杂度表里，所以归一与渲染收在这里一份，而不是每个页面各写一遍
 * （第 39 轮做术语表与复杂度表时收拢）。
 *
 * 导出：
 *   formatPage(page) -> string       归一成显示文本；缺页码返回空串
 *   pageRef(page, preview) -> Node   页码锚（.pg-ref；preview 用虚线标「预告」）
 * ========================================================================== */

import { h } from './dom.js';

/**
 * 页码归一。
 * - 整数：原样；
 * - 数组：取首尾成区间（页码区间不逐页列），两端相同则退化成单页；
 * - 其它/缺省：空串 —— 调用方据此决定要不要渲染页锚，而不是打印 'undefined'。
 */
export function formatPage(page) {
  if (Array.isArray(page)) {
    const nums = page.filter((n) => Number.isFinite(n));
    if (!nums.length) return '';
    const lo = nums[0];
    const hi = nums[nums.length - 1];
    return lo === hi ? String(lo) : lo + '–' + hi;
  }
  return Number.isFinite(page) ? String(page) : '';
}

/**
 * 页码锚。
 * preview=true 表示「该结论出自后续小节」，用虚线样式标成预告 ——
 * 跨小节引用是允许的，但不能假装它属于当前这一节（红线 R2 的配套要求）。
 */
export function pageRef(page, preview) {
  const label = formatPage(page);
  return h('span', {
    class: 'pg-ref' + (preview ? ' pg-ref--preview' : ''),
    title: preview
      ? '此结论出自后续小节，这里只作预告 —— 完整推导在对应的那一关'
      : '出处：原书印刷页 ' + label,
  }, (preview ? '预告 · 印刷页 ' : '印刷页 ') + label);
}

export default { formatPage, pageRef };
