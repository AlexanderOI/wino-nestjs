export const calculateOrder = (
  previousOrder: number | null,
  nextOrder: number | null,
): number | 'REBALANCE_NEEDED' => {
  if (previousOrder === null && nextOrder === null) {
    return 1000
  }

  if (previousOrder === null) {
    const newOrder = Math.max(nextOrder! - 1000, 100)
    if (nextOrder! - newOrder < 10) {
      return 'REBALANCE_NEEDED'
    }
    return newOrder
  }

  if (nextOrder === null) {
    return previousOrder + 1000
  }

  const intermediateOrder = Math.floor((previousOrder + nextOrder) / 2)

  if (Math.abs(nextOrder - previousOrder) < 10) {
    return 'REBALANCE_NEEDED'
  }

  if (intermediateOrder === previousOrder || intermediateOrder === nextOrder) {
    const fractionalOrder = (previousOrder + nextOrder) / 2
    if (Math.abs(nextOrder - previousOrder) < 5) {
      return 'REBALANCE_NEEDED'
    }
    return fractionalOrder
  }

  return intermediateOrder
}
