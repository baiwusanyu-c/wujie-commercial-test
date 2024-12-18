import { isLeaf } from 'element-plus/es/utils/index.mjs'
import type { CascaderOption } from 'element-plus'
import type { default as CascaderNode } from './node'

export const getMenuIndex = (el: HTMLElement) => {
  if (!el) return 0
  const pieces = el.id.split('-')
  return Number(pieces[pieces.length - 2])
}

export const checkNode = (el: HTMLElement) => {
  if (!el) return

  const input = el.querySelector('input')
  if (input) {
    input.click()
  } else if (isLeaf(el)) {
    el.click()
  }
}

export const sortByOriginalOrder = (oldNodes: CascaderNode[], newNodes: CascaderNode[]) => {
  const newNodesCopy = newNodes.slice(0)
  const newIds = newNodesCopy.map(node => node.uid)
  const res = oldNodes.reduce((acc, item) => {
    const index = newIds.indexOf(item.uid)
    if (index > -1) {
      acc.push(item)
      newNodesCopy.splice(index, 1)
      newIds.splice(index, 1)
    }
    return acc
  }, [] as CascaderNode[])

  res.push(...newNodesCopy)

  return res
}

export function filterTree(val: string, tree: CascaderOption[], newArr: CascaderOption[] = []) {
  if (!(tree.length && val)) {
    return tree
  }
  for (let item of tree) {
    if (item.label && item.label.indexOf(val) > -1) {
      newArr.push(item)
      continue
    }

    if (item.children && item.children.length) {
      let subArr = filterTree(val, item.children)
      if (subArr && subArr.length) {
        let node = { ...item, children: subArr }
        newArr.push(node)
      }
    }
  }
  return newArr
}
export function flattenTree(tree: CascaderNode[]) {
  const result: CascaderNode[] = []

  function recurse(nodes: CascaderNode[]) {
    nodes.forEach((node) => {
      result.push(node)
      if (node.children && node.children.length) {
        recurse(node.children)
      }
    })
  }

  recurse(tree)
  return result
}
