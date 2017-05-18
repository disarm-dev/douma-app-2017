export const elements_array = (form) => {
  let arr = []
  form.pages.forEach((page, i) => {
    if (page.elements)
    page.elements.forEach(element => {
      arr.push({
        page: i,
        name: element.name, 
        type: element.type
      })
    })
  })
  return arr
}