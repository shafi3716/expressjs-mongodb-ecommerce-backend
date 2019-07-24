const validator = require('validator')
const isEmpty = require('../common/isEmpty')

module.exports = validateRegister = (data) => {
    
      let errors = {};

      data.name = !isEmpty(data.name) ? data.name : '';
      data.email = !isEmpty(data.email) ? data.email : '';
      data.password = !isEmpty(data.password) ? data.password : '';
  
      if (validator.isEmpty(data.name)){
          errors.name = 'The name is required.';
      }
  
      if (!validator.isEmail(data.email)){
          errors.email = 'The email is invalid.';
      }
      else if (validator.isEmpty(data.email)){
          errors.email = 'The email is required.';
      }
  
      if (validator.isEmpty(data.password)){
          errors.password = 'The password is required.';
      }

      return {
          errors,
          inValid: !isEmpty(errors)
      }
}