const check_all = (form, form_data) => {
  return rules.map((rule) => {
    if (check_rule(rule)){
      return rule.error_message
    }
  })

  const rules = [
    {
      name: 'total_sprayed',
      fn: function(f){
        return f.ddt + f.delatamethrin == f.total
      },
      error_message: 'Total sprayed does not equal `ddt`+ `deltamethrin`.'
    },{
    
    }
  ]
}
