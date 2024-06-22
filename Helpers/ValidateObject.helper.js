const validateObject = (obj, array_props)=>{
    return array_props.every(prop=>obj.hasOwnProperty(prop));
}

module.exports = validateObject;