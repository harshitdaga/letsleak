/*
 * LetsLeak
 * An anonymonus social platform
 * Copyright 2014 LetsLeak
 * https://github.com/harshitdaga/letsleak
*/
var Bucket = new Meteor.Collection('c_bucket');

Bucket.getDetails = function (bucketId) {
    return Bucket.findOne({"_id": bucketId });
};

Bucket.getBucketName = function (bucketId) {
    var bucket = this.getDetails();
    return AppCommon._isEmpty(bucket) ? null : bucket.f_bucket.f_name;
};

Bucket.getPostIdList = function (bucketId) {
    var bucket = Bucket.findOne({"_id": bucketId });
    return (AppCommon._isEmpty(bucket) || AppCommon._isEmpty(bucket.f_post_id_list)) ? [] : bucket.f_post_id_list;
};

//Bucket.getUserBucketList = function(){
//    var selector = {"user_id" :  App.extensions._getUserId()};
//    return Bucket.find(selector);
//};

/*
 * Add query methods
 */
//Bucket.getOwnBuckets = function(){
//	var userId = App.extensions._getUserId();
//	var result = Bucket.find(
//		{user_id: userId},
//        {
//            sort : { timeStamp : -1}
//        }
//	)
//	return result;
//};
//
//Bucket.ownBucketExist = function(){
//	//console.log("ownBucketExist : " +  this.getOwnBuckets());
//	var result = this.getOwnBuckets();
//	if( !_.isUndefined(result) && !_.isEmpty(result)){
//		return true;
//	}
//	return false;
//};

Bucket.getEditorSelection = function () {
    var count = 0;
    return Bucket.find({
        "f_bucket.f_access": "PUBLIC"
    }, {
        sort: { f_timestamp: -1}
    }).map(function (item) {
            item.index = count;
            count++;
            return item;
        });
};

//Bucket.getBucketById = function(bucket_id){
//    var selector = {
//        "_id" : bucket_id
//    }
//    return Bucket.findOne(selector);
//};
//
//Bucket.getPostListForBucket = function(bucket_id){
//    var bucket = Bucket.getBucketById(bucket_id);
//    console.log(bucket.bucket);
//    return bucket && bucket.post_id_list;
//};

_.extend(AppCollection, {
    Bucket: Bucket
});