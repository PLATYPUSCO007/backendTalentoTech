const folder = {
  setFolder: function (nameFolder) {
    return (req, res, next) => {
      req.folder = nameFolder;
      next();
    };
  },
};

module.exports = folder;
