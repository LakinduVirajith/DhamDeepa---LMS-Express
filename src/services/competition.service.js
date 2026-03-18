import Competition from '../models/competition.model.js';

/**
 * Create a new competition
 *
 * @param {Object} data - Competition payload
 * @param {Object} user - Authenticated user (req.user)
 *
 * @returns {Object} Created competition
 */
export const createCompetitionService = async (data, user) => {
  data.createdBy = user._id;
  const comp = await Competition.create(data);
  return comp;
};

/**
 * Get competition by ID
 *
 * @param {String} id - Competition ID
 * @returns {Object} Competition document
 */
export const getCompetitionByIdService = async (id) => {
  const comp = await Competition.findById(id).populate(
    'participants.student',
    'personalInfo.fullName academicInfo.schoolGrade',
  );

  if (!comp) throw new Error('Competition not found');
  return comp;
};

/**
 * Get all competitions with pagination, filters, sorting, and search
 *
 * @param {Object} params
 * @param {Number} params.page   - Page number
 * @param {Number} params.limit  - Items per page
 * @param {Number} params.year   - Filter by competition year
 * @param {String} params.sort   - Sort order ('asc' | 'desc')
 * @param {String} params.search - Search keyword (type/location)
 *
 * @returns {Object} Paginated competitions result
 */
export const getAllCompetitionsService = async ({
  page,
  limit,
  year,
  sort,
  search,
}) => {
  const skip = (page - 1) * limit;

  const filter = {};

  // Filter by year
  if (year) {
    filter.year = Number(year);
  }

  // Search (type or location)
  if (search) {
    filter.$or = [
      { competitionType: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  // Sort
  let sortOption = { eventDate: -1 }; // default DESC
  if (sort === 'asc') sortOption = { eventDate: 1 };
  if (sort === 'desc') sortOption = { eventDate: -1 };

  const competitions = await Competition.find(filter)
    .populate(
      'participants.student',
      'personalInfo.fullName academicInfo.schoolGrade',
    )
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await Competition.countDocuments(filter);

  return {
    data: competitions,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

/**
 * Update competition by ID
 *
 * @param {String} id   - Competition ID
 * @param {Object} data - Updated fields
 *
 * @returns {Object} Updated competition
 */
export const updateCompetitionService = async (id, data) => {
  if (data.eventDate) {
    data.year = new Date(data.eventDate).getFullYear();
  }

  const comp = await Competition.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!comp) throw new Error('Competition not found');
  return comp;
};

/**
 * Delete competition by ID
 *
 * @param {String} id - Competition ID
 */
export const deleteCompetitionService = async (id) => {
  const comp = await Competition.findByIdAndDelete(id);
  if (!comp) throw new Error('Competition not found');
};

/**
 * Add a participant to a competition
 *
 * @param {String} competitionId - Competition ID
 * @param {String} studentId     - Student ID
 *
 * @returns {Object} Updated competition
 */
export const addParticipantService = async (competitionId, studentId) => {
  const comp = await Competition.findById(competitionId);
  if (!comp) throw new Error('Competition not found');

  // Prevent duplicate
  const exists = comp.participants.some(
    (p) => p.student.toString() === studentId,
  );
  if (exists) throw new Error('Student already added');

  comp.participants.push({ student: studentId });
  await comp.save();

  return comp;
};

/**
 * Remove a participant from a competition
 *
 * @param {String} competitionId - Competition ID
 * @param {String} studentId     - Student ID
 *
 * @returns {Object} Updated competition
 */
export const removeParticipantService = async (competitionId, studentId) => {
  const comp = await Competition.findById(competitionId);
  if (!comp) throw new Error('Competition not found');

  comp.participants = comp.participants.filter(
    (p) => p.student.toString() !== studentId,
  );

  await comp.save();
  return comp;
};
