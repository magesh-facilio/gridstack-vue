
export const findIndex = (layout, id) => {
    if (!layout || !id) {
        return [-1, -1, null]
    }
    let parentIndex = layout.findIndex((widget) => widget.id == id)
    let childIndex = -1
    let widget = null
    if (parentIndex < 0) {
        for (let i=0; i < layout.length; i++) {
            if (layout[i].children) {
                childIndex = layout[i].children.findIndex((child) => child.id == id)
                if (childIndex >= 0) {
                    parentIndex = i
                    widget = layout[i].children[childIndex]
                    break
                }
            }
        }
    }
    else {
        widget = layout[parentIndex]
    }

    return [parentIndex, childIndex, widget]
}