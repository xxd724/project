import ajax from "@/ajax/http.js"

export const get_current_version = data => ajax({
	name: "get_current_version",
	data
})
