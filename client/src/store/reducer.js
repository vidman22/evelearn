import * as actionTypes from './actionTypes';
import merge from 'lodash/merge';


// byId : {
// 	"formIndex0" : {
// 		id: "formIndex1",
// 		correct: true,
// 	}
// },
// allIds : ["formIndex0", "formIndex1"]
// },
const initialState = {
	user: null,
	lessonSet: [],
	insertTexts: {},
	omissions: {},
	omissionsWithOptions: {},
}

const reducer = (state = initialState , action) => {
	if (action.type === actionTypes.AUTH_SUCCESS) {
		return {
			...state,
			user: {
				id: action.id,
				email: action.email,
				username: action.username,
				picture: action.picture,
				userID: action.uuid
				
			}
		}
	}
	if (action.type === actionTypes.AUTH_FAIL) {
		return {
			...state,
			auth: action.val
		}
	}
	if (action.type === actionTypes.LESSON_SET) {
		return {
			...state,
			lessonSet: action.lesson
		}
	}
	if (action.type === actionTypes.LOGOUT) {
		return {
			...state,
			user: null,
		}
	}
	if (action.type === actionTypes.INSERT_TEXTS){
		console.log("insert text", state.insertTexts, action.insertTexts);
		const insertTexts = action.insertTexts;
		return merge({}, state, insertTexts);
	}
	if (action.type === actionTypes.OMISSIONS){
		console.log("redux state omission", state.omissions, action.omissions);
		const omissions = action.omissions;
		const merged = merge({}, state, omissions);
		return merged;
	}
	if (action.type === actionTypes.OMISSION_WITH_OPTIONS){
		console.log("redux state omissionWithOptions", action.omissionsWithOptions)
		const omissionsWithOptions = action.omissionsWithOptions
		const merged = merge({}, state, omissionsWithOptions);
		console.log("merged", merged)
		return merged
	}
	return state;
}

export default reducer;