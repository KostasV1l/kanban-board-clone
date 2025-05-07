const { ROLES } = require("../config/constants");
const BaseService = require("./base.service");
const User = require("../models/user.model");
const BoardMember = require("../models/boardMember.model");
const mongoose = require("mongoose");
const socketEvents = require("../utils/socketEvents");
const { BadRequestError, UserNotFoundError, MemberExistsError, NotFoundError } = require("../utils/ApiError");

class MemberService extends BaseService {
    constructor() {
        super(BoardMember);
    }

    async inviteUserByEmail(boardId, email, role = ROLES.VIEWER) {
        if (!boardId) {
            throw new BadRequestError("Board ID is required");
        }

        if (!email) {
            throw new BadRequestError("Email is required");
        }

        if (!Object.values(ROLES).includes(role)) {
            throw new BadRequestError(`Invalid role. Valid roles are: ${Object.values(ROLES).join(", ")}`);
        }

        let session = null;
        
        try {
            session = await mongoose.startSession();
            session.startTransaction();
            
            const user = await User.findOne({ email }).session(session);

            if (!user) {
                throw new UserNotFoundError("Email doesn't match any registered user");
            }

            const existingMembership = await this.model
                .findOne({
                    user: user._id,
                    board: boardId,
                })
                .session(session);

            if (existingMembership) {
                const membership = {
                    id: existingMembership.id,
                    email: user.email,
                    role: existingMembership.role,
                };
                throw new MemberExistsError("User is already a member of this board", membership);
            }

            const newMembershipDoc = new this.model({
                board: boardId,
                user: user._id,
                role,
            });

            await newMembershipDoc.save({ session });
            await session.commitTransaction();
            
            const resultDoc = await this.model.findById(newMembershipDoc._id).populate("user", "id username email");
            
            // Emit member add socket event
            socketEvents.memberAdded(boardId, {
                member: resultDoc
            });
            
            return resultDoc;
        } catch (error) {
            if (session) {
                try {
                    if (session.transaction && session.transaction.state === 'active') {
                        await session.abortTransaction();
                    }
                } catch (abortError) {
                    console.error("Error during transaction abort:", abortError);
                }
            }
            throw error;
        } finally {
            if (session) {
                try {
                    await session.endSession();
                } catch (endError) {
                    console.error("Error ending session:", endError);
                }
            }
        }
    }

    async deleteMember(memberId, boardId) {
        if (!memberId || !boardId) {
            throw new BadRequestError("Member ID and Board ID are required");
        }

        let session = null;
        
        try {
            session = await mongoose.startSession();
            session.startTransaction();
            
            const membership = await this.model
                .findOne({
                    user: memberId,
                    board: boardId,
                })
                .session(session);

            if (!membership) {
                throw new NotFoundError("Member not found");
            }

            // Delete membership of board
            const result = await this.model.findByIdAndDelete(membership._id).session(session);
            await session.commitTransaction();
            
            // Emit the socket event
            socketEvents.memberRemoved(boardId, membership.user.toString());

            return result;
        } catch (error) {
            if (session) {
                try {
                    if (session.transaction && session.transaction.state === 'active') {
                        await session.abortTransaction();
                    }
                } catch (abortError) {
                    console.error("Error during transaction abort:", abortError);
                }
            }
            throw error;
        } finally {
            if (session) {
                try {
                    await session.endSession();
                } catch (endError) {
                    console.error("Error ending session:", endError);
                }
            }
        }
    }

    async updateMemberRole(memberId, boardId, newRole) {
        if (!memberId || !boardId) {
            throw new BadRequestError("Member ID and Board ID are required");
        }

        if (!Object.values(ROLES).includes(newRole)) {
            throw new BadRequestError(`Invalid role. Valid roles are: ${Object.values(ROLES).join(", ")}`);
        }

        let session = null;
        
        try {
            session = await mongoose.startSession();
            session.startTransaction();
            
            const membership = await this.model
                .findOne({
                    user: memberId,
                    board: boardId,
                })
                .session(session);

            if (!membership) {
                throw new NotFoundError("Member not found");
            }

            membership.role = newRole;
            await membership.save({ session });
            await session.commitTransaction();
            
            const updatedMembership = await this.model
                .findById(membership._id)
                .populate("user", "id username email");
            
            
            return updatedMembership;
        } catch (error) {
            if (session) {
                try {
                    if (session.transaction && session.transaction.state === 'active') {
                        await session.abortTransaction();
                    }
                } catch (abortError) {
                    console.error("Error during transaction abort:", abortError);
                }
            }
            throw error;
        } finally {
            if (session) {
                try {
                    await session.endSession();
                } catch (endError) {
                    console.error("Error ending session:", endError);
                }
            }
        }
    }
}

module.exports = new MemberService();
