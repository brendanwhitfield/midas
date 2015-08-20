/**
 * AttachmentController
 *
 * @module		:: Controller
 * @description	:: Access to the mapping between files and projects/tasks.
 */
var async = require('async');

function getFile (a, cb) {
  File.findOneById(a.file, function (err, file) {
    if (file) {
      delete file['data'];
      a.file = file;
    }
    cb(err);
  });
};

function findAll (target, req, res) {
  var where = {};
  where[target] = req.params.id;
  Attachment.find(where)
  .sort({ createdAt: -1 })
  // .populate("file") // this causes waterline to ignore deletedAt values, which is a problem...
  .exec(function (err, ats) {
    if (err) { return res.send(400, { message: 'Error fetching attachments.' }); }
    async.each(ats, getFile, function (err) {
      if (err) { return res.send(400, { message: 'Error fetching files.' }); }
      res.send(ats);
    });
  });
};

module.exports = {

  findAllByProjectId: function (req, res) {
    return findAll('projectId', req, res);
  },

  findAllByTaskId: function (req, res) {
    return findAll('taskId', req, res);
  },

  findAllByUserId: function (req, res) {
    return findAll('userId', req, res);
  },

};
