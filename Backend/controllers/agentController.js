import Agent from "../models/Agent.js";
import User from "../models/User.js";

export const createAgent = async (req, res) => {
  try {
    const { name, email, phone, address, photo } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ message: "Name, email and phone are required" });
    const exists = await Agent.findOne({ email });
    if (exists) return res.status(400).json({ message: "Agent with this email already exists" });
    const agent = await Agent.create({ name, email, phone, address, photo: photo || "", createdBy: req.user?._id });
    res.status(201).json(agent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getPublicAgents = async (req, res) => {
  try {
    const agents = await Agent.find({ isActive: true }).select("name email phone address photo").sort({ createdAt: -1 });
    res.json(agents);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    res.json(agent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    const { name, email, phone, address, isActive, photo } = req.body;
    if (email && email !== agent.email) {
      const existing = await Agent.findOne({ email });
      if (existing) return res.status(400).json({ message: "Another agent already uses this email" });
    }
    agent.name = name ?? agent.name;
    agent.email = email ?? agent.email;
    agent.phone = phone ?? agent.phone;
    agent.address = address ?? agent.address;
    agent.photo = photo ?? agent.photo;
    if (typeof isActive === "boolean") agent.isActive = isActive;
    await agent.save();
    res.json(agent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: "Agent removed" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
