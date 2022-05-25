<template>
	<view class="swiper-wrapper">
		<swiper :style="{height:height+'rpx'}" class="swiper-box" :indicator-dots="showindicator" :indicator-active-color="indicatorActiveColor"
		 :indicator-color="indicatorColor" :circular="circular">
			<swiper-item class="swiper-item" v-for="item in bannerList" :key="item">
				<image class="banner" :src="item" :style="{height:height+'rpx'}"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		props: {
			bannerList: {
				type: Array,
				default () {
					return []
				}
			},
			showindicator: {
				type: Boolean,
				default: true
			},
			indicatorColor: {
				type: String,
				default: '#fff'
			},
			indicatorActiveColor: {
				type: String,
				default: '#FE3A3A'
			},
			circular: {
				type: Boolean,
				default: true
			},
			height: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss">
	.swiper-wrapper {
		.swiper-box {
			width: 100%;

			.swiper-item {
				.banner {
					width: 100%;
				}
			}
		}
	}
</style>
