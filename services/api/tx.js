/** Services */
import { API } from "@/services/config"

export const fetchTransactions = async ({ limit, offset, sort, msg_type }) => {
	try {
		const url = new URL(`${API}/tx`)

		if (limit) url.searchParams.append("limit", limit)
		if (offset) url.searchParams.append("offset", offset)
		if (sort) url.searchParams.append("sort", sort)
		if (msg_type) url.searchParams.append("msg_type", msg_type)

		const data = await useFetch(url.href)
		return data
	} catch (error) {
		console.error(error)
	}
}

/** Latest PayForBlobs */
export const fetchLatestPFBs = async (height) => {
	try {
		const data = await useFetch(`${API}/tx?msg_type=MsgPayForBlobs&sort=desc&limit=5`)
		return data
	} catch (error) {
		console.error(error)
	}
}

export const fetchTransactionsByBlock = async (height) => {
	try {
		const data = await useFetch(`${API}/tx?height=${height}`)
		return data
	} catch (error) {
		console.error(error)
	}
}
