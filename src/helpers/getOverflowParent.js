const getOverflowParent = (node) => {
  if (!node) {
    return null;
  }

  const isElement = node instanceof HTMLElement;
  const overflowY = isElement && (window.getComputedStyle(node).overflowY || window.getComputedStyle(node).overflow);
  const isOverflow = overflowY !== 'visible';

  if (isOverflow && node.scrollHeight >= node.clientHeight) {
    return node;
  }

  return getOverflowParent(node.parentNode) || document.body;
};

export default getOverflowParent;
