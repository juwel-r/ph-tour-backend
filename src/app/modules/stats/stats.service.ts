import { Tour } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";

const now = new Date();

const sevenDayAgo = new Date(now).setDate(now.getDate()-7)
const thirtyDayAgo = new Date(now).setDate(now.getDate()-30)


const getUserStats = async ()=>{

    const totalUsersPromise = User.countDocuments()
    const totalActiveUsersPromise = User.countDocuments({isActive:IsActive.ACTIVE})
    const totalInActiveUsersPromise = User.countDocuments({isActive:IsActive.INACTIVE})
    const totalBlockedUsersPromise = User.countDocuments({isActive:IsActive.BLOCK})
    
    const usersFromSevenDayPromise = User.countDocuments({createdAt:{$gte:sevenDayAgo}})
    const usersFromThirtyDayPromise = User.countDocuments({createdAt:{$gte:thirtyDayAgo}})    
    /**
     imagine -> 
     today is 9/2/2025
     7 day ago = 2/2/2025
     {createdAt:{$gte:sevenDayAgo} => createdAt >= 2/2/2025 (2/2/2025 -> 9/2/2025)
    */

     const userPerRolePromise = User.aggregate([
        {
            $group:{
                _id:"$role",
                count:{$sum:1}
            }
        }
     ])

  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    usersFromSevenDay,
    usersFromThirtyDay,
    userPerRole,
  ] = await Promise.all([
    totalUsersPromise,
    totalActiveUsersPromise,
    totalInActiveUsersPromise,
    totalBlockedUsersPromise,
    usersFromSevenDayPromise,
    usersFromThirtyDayPromise,
    userPerRolePromise,
  ]);

    return {
            totalUsers,
            totalActiveUsers,
            totalInActiveUsers,
            totalBlockedUsers,
            usersFromSevenDay,
            usersFromThirtyDay,
            userPerRole,
    }
}

const getTourStats = async ()=>{

    const totalTourPromise = Tour.countDocuments();
    const tourPerTypePromise = Tour.aggregate([
        //1st stage: lookup
        {
            $lookup:{
                from:"tourtypes",
                localField:"tourType",
                foreignField:"_id",
                as:"type"
            }
        },
        // unwind type
        {
            $unwind:"$type"
        },
        //stage 3: group by tourType
        {
            $group:{
            _id:"$type.name",
            count:{$sum:1}
        }
        
            
        }
    ])
    const tourPerDivisionPromise = Tour.aggregate([
        {
            $lookup:{
                from:"divisions",
                localField:"division",
                foreignField:"name",
                as:"divisionName"
            }
        },
        {
            $unwind:"$divisionName"
        },
        {
            $group:{
                _id:"$divisionName.name",
                count:{$sum:1}
            }
        }
    ])
    const averageTourCostPromise = Tour.aggregate([
        {
            $group:{
                _id:null,
                averageCost:{$avg:"$costFrom"}
            }
        }
    ])

    const [totalTour,tourPerType,averageTourCost,tourPerDivision] = await Promise.all([
        totalTourPromise,
        tourPerTypePromise,
        averageTourCostPromise,
        tourPerDivisionPromise
    ])
    return {totalTour,tourPerType,averageTourCost,tourPerDivision}
}

const getBookingStats=async ()=>{
    return {}
}

const getPaymentStats = async ()=>{
    return {}
}


export const StatsService = {
    getUserStats,
    getTourStats,
    getBookingStats,
    getPaymentStats,
};
