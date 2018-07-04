<template>
    <section>
        <!--课程列表-->

        <!--新增、编辑课程-->

        
    </section>
    
    
</template>
<script>
import 
{ 
 urlAddCoach, urlQueryAllList, urlQueryCourseByCoachId, urlQueryDetailById, urlUpdateCoach,urlDelCoachCourseById
 } from "../api/req_course";

import {responeSucCode} from '../api/response'
import util from '../common/js/util'
import formUtil from '../common/js/formUitl'
import Pageination from '../components/pagination'
export default {
    data:function(){
        return {
            
        }
    },
    methods:{
        //1 初始化列表
        //2 新增方法
        //3 提交方法
        //4 编辑方法
        //
    },
    mounted() {
     
    },
	components:{
		'pagination':Pageination
	}
}
</script>
