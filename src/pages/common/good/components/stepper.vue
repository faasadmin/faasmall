<template>
	<view class="stepper-wrapper" :class="size === 'small' ? 'small' : ''">
		<view class="reduce" @tap="reduce" :class="{ noclick: minusDisabled }"></view>
		<view class="num-wrapper"><input class="num-content" type="number" v-model="currentValue" @blur="onBlur" @input="onInput" :disabled="display" /></view>
		<view class="add" :class="{ noclick: plusDisabled }" @tap="add"></view>
	</view>
</template>

<script>
export default {
	props: {
		size: {
			type: String
		},
		min: {
			type: [Number, String],
			default: 1
		},
		max: {
			type: [Number, String],
			default: Infinity
		},
		defaultValue: {
			type: [Number, String],
			default: 1
		},
		display: {
			type: [Boolean, String],
			default: false
		}
	},
	data() {
		const value = this.defaultValue;
		return {
			currentValue: value
		};
	},
	watch: {
		defaultValue(newValue) {
			this.currentValue = newValue;
		},
		currentValue(newValue) {
			this.$emit('change', this.currentValue);
		}
	},
	computed: {
		minusDisabled() {
			return this.display || this.currentValue <= this.min;
		},

		plusDisabled() {
			return this.display || this.currentValue >= this.max;
		}
	},
	methods: {
		format(value) {
			value = String(value).replace(/[^0-9.-]/g, '');
			return value === '' ? 1 : Math.floor(value);
		},
		onBlur(event){
			let value = event.detail.value;
			this.currentValue = this.format(value) > this.max ? parseInt(this.max) : this.format(value);
		},
		onInput(event) {
			// let value = event.detail.value;
			// setTimeout(() => {
			// 	this.currentValue = this.format(value) > this.max ? parseInt(this.max) : this.format(value);
			// }, 0);
		},
		reduce() {
			if (!this.minusDisabled) {
				this.currentValue--;
			}
		},
		add() {
			if (!this.plusDisabled) {
				this.currentValue++;
			}
		}
	}
};
</script>

<style lang="scss">
.stepper-wrapper {
	display: inline-flex;
	flex-direction: row;
	flex-flow: wrap;

	&.small {
		.reduce,
		.num-wrapper,
		.add {
			width: 68rpx;
			height: 40rpx;
		}

		.reduce {
			&::after {
				width: 20rpx;
			}
		}

		.add {
			&::before,
			&::after {
				width: 20rpx;
			}
		}
		.num-wrapper {
			border-radius: 10rpx;
			overflow: hidden;

			.num-content {
				width: 100%;
				height: 100%;
				background-color: #f4f4f4;
				min-height: 40rpx; //修改input默认样式
				line-height: 40rpx;
				font-size: 28rpx;
				text-align: center;
			}
		}
	}

	.reduce,
	.num-wrapper,
	.add {
		width: 100rpx;
		height: 56rpx;
		position: relative;
	}

	.reduce {
		&::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			width: 28rpx;
			height: 4rpx;
			border-radius: 2rpx;
			background-color: #333333;
			margin: auto;
		}
		&.noclick {
			&::after {
				background-color: #cccccc;
			}
		}
	}

	.num-wrapper {
		border-radius: 10rpx;
		overflow: hidden;

		.num-content {
			width: 100%;
			height: 100%;
			background-color: #f4f4f4;
			min-height: 56rpx; //修改input默认样式
			line-height: 56rpx;
			font-size: 30rpx;
			text-align: center;
		}
	}

	.add {
		&::before,
		&::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			width: 28rpx;
			height: 4rpx;
			border-radius: 2rpx;
			background-color: #333333;
			margin: auto;
		}

		&::after {
			transform: rotate(90deg);
		}

		&.noclick {
			&::before,
			&::after {
				background-color: #cccccc;
			}
		}
	}
}
</style>
