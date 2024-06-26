const {FollowModel} = require('../Models/Index.models');

const FollowService = {
    dataFollowOne: async (identityId, profileId)=>{
        try {
            if (!identityId || !profileId) throw new Error('Los ids no son validos');
            
            const followingData = await FollowModel.findOne({
                following_user: identityId,
                followed_user: profileId
            }).exec();

            const followerData = await FollowModel.findOne({
                following_user: profileId,
                followed_user: identityId
            }).exec();

            return {
                followingData,
                followerData,
            }

        } catch (error) {
            console.error('No se puede obtener la info de seguimiento');
            return {
                followingData: null,
                followerData: null,
            }
        }
    },
    arrayFollowingAndFollowed: async (identityId)=>{
        try {
            console.log(identityId);
            if (!identityId) throw new Error('Los ids no son validos');

            let dataFollowings = await FollowModel.find({
                following_user: identityId
            }).select({'followed_user': 1, '_id': 0}).exec();

            let dataFollowers = await FollowModel.find({
                followed_user: identityId
            }).select({'following_user': 1, '_id': 0}).exec();

            dataFollowings = dataFollowings.map(data=>data.followed_user); 
            dataFollowers = dataFollowers.map(data=>data.following_user);

            const followData = {
                dataFollowings,
                dataFollowers
            }

            return followData;

        } catch (error) {
            console.error('No se puede obtener la info de seguimiento');
            return {
                followData: null
            }
        }
    }
}

module.exports = FollowService;