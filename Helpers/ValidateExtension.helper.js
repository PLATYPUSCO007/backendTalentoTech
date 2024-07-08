const extensionsFile = ["png", "jpg", "jpeg", "gif"];

const isValideExtension = (extension)=>{
  return extensionsFile.some((extension) =>
      extension.includes(extension),
  );
}

module.exports = isValideExtension;