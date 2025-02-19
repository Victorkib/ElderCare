import Caregiver from '../models/caregiver.model.js';
import mongoose from 'mongoose';
import Elder from '../models/elder.model.js';

// Get all caregivers with pagination and filtering
export const getCaregivers = async (req, res) => {
  try {
    let { page = 1, limit = 5, status } = req.query;

    // Convert to numbers & enforce minimum values
    page = Math.max(Number(page), 1);
    limit = Math.max(Number(limit), 1);

    // Build query
    const query = status && status !== 'all' ? { status } : {};

    // Fetch caregivers with pagination & populate assigned elders
    const caregivers = await Caregiver.find(query)
      .populate({ path: 'assignedElders', select: 'firstName roomNumber' })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    // Count total caregivers
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Step 1: Find elders assigned to this caregiver
    const elders = await Elder.find({ assignedCaregivers: id }).session(
      session
    );

    if (elders.length > 0) {
      // Step 2: Remove the caregiver from each elder's assignedCaregivers list
      await Elder.updateMany(
        { assignedCaregivers: id },
        { $pull: { assignedCaregivers: id } },
        { session }
      );
    }

    // Step 3: Delete the caregiver after ensuring they are removed from all elders
    const deletedCaregiver = await Caregiver.findByIdAndDelete(id, { session });

    if (!deletedCaregiver) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    // Step 4: Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: 'Caregiver deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res
      .status(500)
      .json({ message: 'Failed to delete caregiver', error: error.message });
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
