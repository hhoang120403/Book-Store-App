import Address from '../models/Address.js';

export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.userId;

    await Address.create({ ...address, userId });

    return res.status(201).json({
      success: true,
      message: 'Address created successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      addresses,
      message: 'Fetch address successfully',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
