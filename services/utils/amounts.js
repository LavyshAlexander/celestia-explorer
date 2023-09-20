export const comma = (target, symbol = ",") => {
	if (!target) return 0

	let num = parseFloat(target)

	if (num % 1 === 0) {
		num = num.toFixed(0)
	} else {
		num = num.toFixed(2)
	}

	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, symbol)
}

export const truncate = (num) => {
	if (!num) return num

	/** todo: refactor */
	if (num.toString().includes("e")) return 0

	const [left, right] = num.toString().split(".")
	let result = ""
	const rightArr = right ? right.split("") : []

	for (let i = 0; i < rightArr.length; i++) {
		const digit = rightArr[i]
		const nextDigit = rightArr[i + 1] && rightArr[i + 1] != 0 ? rightArr[i + 1] : ""

		if (digit == "0" || digit == ".") {
			result += digit
		} else {
			result += `${digit}${nextDigit}`
			break
		}
	}

	return left + (result ? `.${result}` : "")
}

export const tia = (amount) => {
	if (!amount || !parseInt(amount)) return 0
	return truncate(parseInt(amount) / 1_000_000)
}
