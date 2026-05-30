import { describe, expect, it } from 'bun:test';

type CartLine = {
  id: string;
  quantity: number;
};

function addLine(lines: CartLine[], line: CartLine) {
  return [...lines, line];
}

function updateLine(lines: CartLine[], lineId: string, quantity: number) {
  return lines.map((line) =>
    line.id === lineId ? { ...line, quantity } : line,
  );
}

function removeLine(lines: CartLine[], lineId: string) {
  return lines.filter((line) => line.id !== lineId);
}

describe('Cart flow integration', () => {
  it('supports add, update, and remove operations in sequence', () => {
    const added = addLine([], { id: 'line-1', quantity: 1 });
    expect(added).toHaveLength(1);
    expect(added[0]?.quantity).toBe(1);

    const updated = updateLine(added, 'line-1', 3);
    expect(updated[0]?.quantity).toBe(3);

    const removed = removeLine(updated, 'line-1');
    expect(removed).toHaveLength(0);
  });
});
