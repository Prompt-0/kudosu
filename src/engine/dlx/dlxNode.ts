export class DLXNode {
  left: DLXNode;
  right: DLXNode;
  up: DLXNode;
  down: DLXNode;
  column: DLXColumnNode;
  rowIndex: number;

  constructor(column?: DLXColumnNode, rowIndex: number = -1) {
    this.left = this;
    this.right = this;
    this.up = this;
    this.down = this;
    this.column = column || (this as unknown as DLXColumnNode);
    this.rowIndex = rowIndex;
  }
}

export class DLXColumnNode extends DLXNode {
  size: number;
  name: string;

  constructor(name: string) {
    super();
    this.size = 0;
    this.name = name;
    this.column = this;
  }

  cover(): void {
    this.right.left = this.left;
    this.left.right = this.right;

    let row = this.down;
    while (row !== this) {
      let node = row.right;
      while (node !== row) {
        node.down.up = node.up;
        node.up.down = node.down;
        node.column.size--;
        node = node.right;
      }
      row = row.down;
    }
  }

  uncover(): void {
    let row = this.up;
    while (row !== this) {
      let node = row.left;
      while (node !== row) {
        node.column.size++;
        node.down.up = node;
        node.up.down = node;
        node = node.left;
      }
      row = row.up;
    }

    this.right.left = this;
    this.left.right = this;
  }
}
