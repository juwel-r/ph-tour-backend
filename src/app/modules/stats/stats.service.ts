import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
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
                foreignField:"_id",
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

    const popularToursPromise = Booking.aggregate([
        {
            $group:{
                _id:"$tour",
                bookingCount:{$sum:1}
            }
        },
        {
            $sort:{bookingCount:-1}
        },
        {
            $limit:5
        },
        // {
        //    $lookup:{
        //     from:"tours",
        //     localField:"_id",
        //     foreignField:"_id",
        //     as:"tour"
        //    }
        // }
        {
            $lookup:{
                from:"tours",
                let:{tourId:"$_id"}, //this is local -> booking collection's _id as tourId -> Module 33.10
                pipeline:[
                    {
                        $match:{
                            $expr:{$eq:["$_id", "$$tourId"]}
                        }
                    }
                ],
                as:"tour"
            }
        },
        {
            $unwind:"$tour"
        },
        {
            $project:{
                bookingCount:1,
                "tour.title":1,
                "tour.costFrom":1
            }
        },
        {
            $unwind:"$tour"
        }
    ])


    const [totalTour,tourPerType,averageTourCost,tourPerDivision, popularTours] = await Promise.all([
        totalTourPromise,
        tourPerTypePromise,
        averageTourCostPromise,
        tourPerDivisionPromise,
        popularToursPromise
    ])
    return {totalTour,tourPerType,averageTourCost,tourPerDivision, popularTours}
}

const getBookingStats = async () => {
    const totalBookingPromise = Booking.countDocuments()

    const totalBookingByStatusPromise = Booking.aggregate([
        //stage-1 group stage
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    const bookingsPerTourPromise = Booking.aggregate([
        //stage1 group stage

        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },

        //stage-2 sort stage
        {
            $sort: { bookingCount: -1 }
        },

        //stage-3 limit stage
        {
            $limit: 10
        },

        //stage-4 lookup stage
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },

        // stage5 - unwind stage
        {
            $unwind: "$tour"
        },

        // stage6 project stage

        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])

    const avgGuestCountPerBookingPromise = Booking.aggregate([
        // stage 1  - group stage
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" }
            }
        }
    ])

    const bookingsLast7DaysPromise = Booking.countDocuments({
        createdAt: { $gte: sevenDayAgo }
    })
    
    const bookingsLast30DaysPromise = Booking.countDocuments({
        createdAt: { $gte: thirtyDayAgo }
    })

    const totalBookingByUniqueUsersPromise = Tour.distinct("division").then((user: any) => user.length)

    const [totalBooking, totalBookingByStatus, bookingsPerTour, avgGuestCountPerBooking, bookingsLast7Days, bookingsLast30Days, totalBookingByUniqueUsers] = await Promise.all([
        totalBookingPromise,
        totalBookingByStatusPromise,
        bookingsPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingsLast7DaysPromise,
        bookingsLast30DaysPromise,
        totalBookingByUniqueUsersPromise
    ])
    return { totalBooking, totalBookingByStatus, bookingsPerTour, avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount, bookingsLast7Days, bookingsLast30Days, totalBookingByUniqueUsers }
}

const getPaymentStats = async () => {

    const totalPaymentPromise = Payment.countDocuments();

    const totalPaymentByStatusPromise = Payment.aggregate([
        //stage 1 group
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    const totalRevenuePromise = Payment.aggregate([
        //stage1 match stage
        {
            $match: { status: PAYMENT_STATUS.PAID }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }
    ])

    const avgPaymentAmountPromise = Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: null,
                avgPaymentAMount: { $avg: "$amount" }
            }
        }
    ])

    const paymentGatewayDataPromise = Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ])



    const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData] = await Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise

    ])
    return { totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData }
}



export const StatsService = {
    getUserStats,
    getTourStats,
    getBookingStats,
    getPaymentStats,
};
