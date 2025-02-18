import Caregiver from '../models/caregiver.model.js';

// Get all caregivers with pagination and filtering
export const getCaregivers = async (req, res) => {
  try {
    const { page = 1, limit = 5, status } = req.query;
    const query = status && status !== 'all' ? { status } : {};

    const caregivers = await Caregiver.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Caregiver.countDocuments(query);

    res.status(200).json({
      caregivers,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch caregivers' });
  }
};

//get single caregiver
export const getSingleCaregiver = async (req, res) => {
  const { caregiverId } = req.params;
  try {
    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) {
      return res.status(400).json({ message: 'No caregiver found!' });
    }
    res.status(200).json(caregiver);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch single caregiver' });
  }
};

// Add a new caregiver
export const addCaregiver = async (req, res) => {
  try {
    const newCaregiver = new Caregiver(req.body);
    await newCaregiver.save();
    res
      .status(201)
      .json({ message: 'Caregiver added successfully', newCaregiver });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add caregiver', error });
  }
};

// Update a caregiver
export const updateCaregiver = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCaregiver = await Caregiver.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: 'Caregiver updated successfully', updatedCaregiver });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update caregiver', error });
  }
};

// Delete a caregiver
export const deleteCaregiver = async (req, res) => {
  try {
    const { id } = req.params;
    await Caregiver.findByIdAndDelete(id);
    res.status(200).json({ message: 'Caregiver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete caregiver', error });
  }
};

// Update caregiver status
export const updateCaregiverStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedCaregiver = await Caregiver.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json({
      message: 'Caregiver status updated successfully',
      updatedCaregiver,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update caregiver status', error });
  }
};
