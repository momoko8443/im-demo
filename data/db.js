module.exports = {
    users:{
        'user_a':{'username':'user_a','password':'123456','friends':['user_b','user_c'],groups:['group_1']},
        'user_b':{'username':'user_b','password':'123456','friends':['user_a','user_c'],groups:['group_1','group_2']},
        'user_c':{'username':'user_c','password':'123456','friends':['user_a','user_b','user_d'],groups:['group_1','group_2']},
        'user_d':{'username':'user_d','password':'123456','friends':['user_c'],groups:['group_2']},
    },
    groups:{
        'group_1':[
            'user_a',
            'user_b',
            'user_c'
        ],
        'group_2':[
            'user_b',
            'user_c',
            'user_d'
        ]
    },
    getMembersByGroup(groupName){
        return this.groups[groupName] ? this.groups[groupName] : [];
    }
}