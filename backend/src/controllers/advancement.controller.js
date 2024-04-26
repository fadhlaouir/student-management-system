const Advancement = require('../models/advancement.model');

// Controller for creating a new advancement
exports.createAdvancement = async (req, res) => {
  try {
    const { tickets, internId, supervisorId, internshipId } = req.body;

    const newAdvancement = new Advancement({
      tickets,
      intern: internId,
      supervisor: supervisorId,
      internship: internshipId,
    });

    const savedAdvancement = await newAdvancement.save();

    res.status(201).json(savedAdvancement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller for getting all advancements
exports.getAllAdvancements = async (req, res) => {
  try {
    const advancements = await Advancement.find().populate(
      'intern supervisor internship',
    );
    res.status(200).json(advancements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller for getting a single advancement by ID
exports.getAdvancementById = async (req, res) => {
  try {
    const advancement = await Advancement.findById(req.params.id).populate(
      'intern supervisor internship',
    );
    if (!advancement) {
      return res.status(404).json({ message: 'Advancement not found' });
    }
    res.status(200).json(advancement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller for updating an advancement by ID
exports.updateAdvancementById = async (req, res) => {
  try {
    const { tickets, internId, supervisorId, internshipId } = req.body;

    const updatedAdvancement = await Advancement.findByIdAndUpdate(
      req.params.id,
      {
        tickets,
        intern: internId,
        supervisor: supervisorId,
        internship: internshipId,
      },
      { new: true },
    );

    if (!updatedAdvancement) {
      return res.status(404).json({ message: 'Advancement not found' });
    }

    res.status(200).json(updatedAdvancement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller for deleting an advancement by ID
exports.deleteAdvancementById = async (req, res) => {
  try {
    const deletedAdvancement = await Advancement.findByIdAndDelete(
      req.params.id,
    );

    if (!deletedAdvancement) {
      return res.status(404).json({ message: 'Advancement not found' });
    }

    res.status(200).json({ message: 'Advancement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
