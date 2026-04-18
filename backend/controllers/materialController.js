const Material = require('../models/Material');

// @desc    Get all approved materials
// @route   GET /api/materials
exports.getMaterials = async (req, res) => {
  try {
    const { category, subject, search } = req.query;
    let query = { status: 'approved' };

    if (category && category !== 'All') query.category = category;
    if (subject) query.subject = new RegExp(subject, 'i');
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { subject: new RegExp(search, 'i') }
      ];
    }

    const materials = await Material.find(query).sort('-createdAt');
    res.status(200).json({ success: true, count: materials.length, data: materials });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single material
// @route   GET /api/materials/:id
exports.getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, error: 'Material not found' });
    res.status(200).json({ success: true, data: material });
  } catch (err) {
    res.status(404).json({ success: false, error: 'Material not found' });
  }
};

// @desc    Upload material
// @route   POST /api/materials
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a file' });

    const materialData = {
      ...req.body,
      fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileName: req.file.originalname,
      uploaderId: req.user.id,
      uploaderName: req.user.name,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    };

    const material = await Material.create(materialData);
    res.status(201).json({ success: true, data: material });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update material status (Admin Only)
// @route   PUT /api/materials/:id/status
exports.updateMaterialStatus = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: material });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Like/Upvote material
// @route   PUT /api/materials/:id/like
exports.likeMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    const index = material.upvotes.indexOf(req.user.id);

    if (index === -1) {
      material.upvotes.push(req.user.id);
      material.likes += 1;
    } else {
      material.upvotes.splice(index, 1);
      material.likes -= 1;
    }

    await material.save();
    res.status(200).json({ success: true, data: material });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Add comment to material
// @route   POST /api/materials/:id/comment
exports.addComment = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    const comment = {
      userId: req.user.id,
      userName: req.user.name,
      text: req.body.text
    };

    material.comments.push(comment);
    await material.save();
    res.status(201).json({ success: true, data: material.comments });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get current user's materials
// @route   GET /api/materials/me
exports.getUserMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ uploaderId: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: materials.length, data: materials });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
