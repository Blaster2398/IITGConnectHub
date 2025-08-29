import Team from "../models/Team.js";
import Role from "../models/Role.js";
import mongoose from "mongoose";

export const createTeam = async (req, res, next) => {
  const newTeam = new Team(req.body);

  try {
    const savedTeam = await newTeam.save();
    res.status(200).json(savedTeam);
  } catch (err) {
    next(err);
  }
};
export const updateTeam = async (req, res, next) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTeam);
  } catch (err) {
    next(err);
  }
};
export const deleteTeam = async (req, res, next) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.status(200).json("Team has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    res.status(200).json(team);
  } catch (err)
  {
    next(err);
  }
};

export const getTeams = async (req, res, next) => {
  const { limit, category, tag, minAvailability, ...others } = req.query;
  try {
    const findCriteria = { ...others };
    if (category) {
      findCriteria.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    // CORRECTED: To query for a single tag within an array, the $in operator is more robust.
    if (tag) {
      findCriteria.tags = { $in: [tag] };
    }

    if (minAvailability && parseInt(minAvailability) > 0) {
      const availabilityNum = parseInt(minAvailability);

      const teams = await Team.aggregate([
        { $match: findCriteria },
        {
          $lookup: {
            from: 'roles',
            localField: 'roles',
            foreignField: '_id',
            as: 'roleDetails'
          }
        },
        {
          $addFields: {
            totalAvailability: { $sum: '$roleDetails.positionsAvailable' }
          }
        },
        {
          $match: {
            totalAvailability: { $gte: availabilityNum }
          }
        },
        { $limit: limit ? parseInt(limit) : 100 }
      ]);
      
      res.status(200).json(teams);

    } else {
      const teams = await Team.find(findCriteria).limit(limit ? parseInt(limit) : 0);
      res.status(200).json(teams);
    }
  } catch (err) {
    next(err);
  }
};


export const countByCategory = async (req, res, next) => {
  const categories = req.query.categories.split(",");
  try {
    const list = await Promise.all(
      categories.map((category) => {
        return Team.countDocuments({ category: category });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByBoard = async (req, res, next) => {
  try {
    const technicalCount = await Team.countDocuments({ board: "Technical" });
    const culturalCount = await Team.countDocuments({ board: "Cultural" });
    const welfareCount = await Team.countDocuments({ board: "Welfare" });
    const sportsCount = await Team.countDocuments({ board: "Sports" });
    const habCount = await Team.countDocuments({ board: "HAB" });

    res.status(200).json([
      { board: "Technical", count: technicalCount },
      { board: "Cultural", count: culturalCount },
      { board: "Welfare", count: welfareCount },
      { board: "Sports", count: sportsCount },
      { board: "HAB", count: habCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getTeamRoles = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    const list = await Promise.all(
      team.roles.map((role) => {
        return Role.findById(role);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};

