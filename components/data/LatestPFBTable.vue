<script setup>
/** Vendor */
import { DateTime } from "luxon"

/** UI */
import Button from "@/components/ui/Button.vue"
import Tooltip from "@/components/ui/Tooltip.vue"
import Spinner from "@/components/ui/Spinner.vue"

/** Services */
import { tia, space, comma } from "@/services/utils"

/** API */
import { fetchLatestPFBs } from "@/services/api/tx"

/** Store */
import { useNotificationsStore } from "@/store/notifications"
const notificationsStore = useNotificationsStore()

const isLoading = ref(true)
const pfbs = ref([])

const { data } = await fetchLatestPFBs()
pfbs.value = data.value
isLoading.value = false

const handleCopy = (target) => {
	window.navigator.clipboard.writeText(target)

	notificationsStore.create({
		notification: {
			type: "info",
			icon: "check",
			title: "Successfully copied to clipboard",
			autoDestroy: true,
		},
	})
}
</script>

<template>
	<Flex wide direction="column" gap="4">
		<Flex align="center" :class="$style.header">
			<Text size="14" weight="600" color="primary">Latest PFBs</Text>
		</Flex>

		<Flex direction="column" gap="16" :class="$style.pfb_body">
			<div v-if="pfbs.length" :class="$style.table_scroller">
				<table>
					<thead>
						<tr>
							<th><Text size="12" weight="600" color="tertiary" noWrap>Hash</Text></th>
							<th><Text size="12" weight="600" color="tertiary" noWrap>Height</Text></th>
							<th><Text size="12" weight="600" color="tertiary" noWrap>When</Text></th>
							<th><Text size="12" weight="600" color="tertiary" noWrap>Fee</Text></th>
						</tr>
					</thead>

					<tbody>
						<tr v-for="pfb in pfbs">
							<td style="width: 1px">
								<Tooltip position="start" delay="500">
									<Outline @click="handleCopy(pfb.hash)" class="copyable">
										<Flex align="center" gap="8">
											<Icon name="zap" size="12" color="green" />

											<Text size="13" weight="700" color="secondary" mono>
												{{ pfb.hash.slice(0, 4).toUpperCase() }}
											</Text>

											<Flex align="center" gap="3">
												<div v-for="dot in 3" class="dot" />
											</Flex>

											<Text size="13" weight="700" color="secondary" mono>
												{{ pfb.hash.slice(pfb.hash.length - 4, pfb.hash.length).toUpperCase() }}
											</Text>
										</Flex>
									</Outline>

									<template #content>
										{{ space(pfb.hash.toUpperCase()) }}
									</template>
								</Tooltip>
							</td>
							<td>
								<NuxtLink :to="`/block/${pfb.height}`">
									<Outline>
										<Flex align="center" gap="6">
											<Icon name="block" size="14" color="tertiary" />

											<Text size="13" weight="600" color="primary">{{ comma(pfb.height) }}</Text>
										</Flex>
									</Outline>
								</NuxtLink>
							</td>
							<td>
								<Text size="13" weight="600" color="primary">{{
									DateTime.fromISO(pfb.time).toRelative({ locale: "en", style: "short" })
								}}</Text>
							</td>
							<td>
								<Flex align="center" gap="4">
									<Text size="13" weight="600" color="primary"> {{ tia(pfb.fee) }} </Text>
									<Text size="13" weight="600" color="tertiary"> TIA </Text>
								</Flex>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<Flex v-else-if="isLoading" align="center" justify="center" gap="8" wide>
				<Spinner size="14" />
				<Text size="13" weight="500" color="secondary"> Loading latest PFBs </Text>
			</Flex>

			<Flex v-else align="center" justify="center" direction="column" gap="8" wide style="margin: 16px 0">
				<Text size="13" weight="600" color="secondary" align="center"> Latest PFBs not found </Text>
				<Text size="12" weight="500" height="160" color="tertiary" align="center" style="max-width: 220px">
					This data is temporarily unavailable
				</Text>
			</Flex>

			<Button link="/transactions" type="secondary" size="small" wide>
				<Text size="12" weight="600" color="primary">View all transactions</Text>
				<Icon name="arrow-narrow-up-right" size="12" color="tertiary" />
			</Button>
		</Flex>
	</Flex>
</template>

<style module>
.header {
	height: 46px;

	border-radius: 8px 8px 4px 4px;
	background: var(--card-background);

	padding: 0 16px;
}

.pfb_body {
	border-radius: 4px 4px 8px 8px;
	background: var(--card-background);

	padding: 16px;

	& table {
		width: 100%;

		border-spacing: 0px;

		& tr th {
			text-align: left;
			padding: 0;
			padding-bottom: 8px;

			& span {
				display: flex;
			}
		}

		& tr td {
			padding: 0;
			padding-right: 24px;
			padding-top: 6px;
			padding-bottom: 6px;

			white-space: nowrap;
		}
	}
}

@media (max-width: 500px) {
	.table_scroller {
		overflow-x: auto;
	}
}
</style>
