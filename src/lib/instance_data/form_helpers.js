export const form_elements = (form) => {
  let arr = []
  form.pages.forEach((page, i) => {
    if (page.elements)
    page.elements.forEach(element => {
      if (arr.find(i => i.name === element.name)) return

      arr.push({
        page: i,
        name: element.name,
        type: element.type
      })
    })
  })
  return arr
}
