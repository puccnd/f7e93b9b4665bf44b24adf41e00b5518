(()=>{
	function updatePriceStyle(flag) {
		if(flag){
			console.log("[INIT] something is calling me...");
		} else {
			console.log("[Event.Handle] something is calling me...");
		}
		
		let variantPrices = {
			"44563383517374": { current: 219, original: 229 },
			"44563383320766": { current: 219, original: 229 },
			"44582336430270": { current: 189, original: 199 },
			"44582336463038": { current: 189, original: 199 },
			"44623034417342": { current: 179, original: 179 },
			"44623034450110": { current: 179, original: 179 },
		};
		let currentURL = window.location.href;
		let selectedVariant = Object.keys(variantPrices).find(variant => currentURL.includes(`variant=${variant}`));
		if(!selectedVariant)selectedVariant="44563383517374"
		console.log(selectedVariant);
		
		if (selectedVariant) {
			Array.from(document.querySelectorAll("span.as-discount-tag:not(.d-none)")).map((spanItem)=>{
				if(spanItem.dataset.variantId != selectedVariant) {
					spanItem.classList.add("d-none");
				}
			});
			let deParent = document.querySelector("span.as-discount-tag[data-variant-id='"+selectedVariant+"']");
			if(!deParent){
				deParent = document.createElement("span");
				deParent.setAttribute("data-variant-id", selectedVariant);
				deParent.className = "text-danger ms-2 as-discount-tag h3";
				deParent.innerHTML = "Save $<span class='as-discount-tag-price' data-unit-price='10'>10</span>";
				let outerBox = document.querySelector(".as-product-price").closest(".mb-3");
				outerBox.appendChild(deParent);
				console.log("add <span> vid="+selectedVariant);
			} else {
				deParent.classList.remove("d-none");
				console.log("set <span> visible, vid="+selectedVariant);
			}
			
			let discountElement = deParent.querySelector(".as-discount-tag-price");
			let originalPriceElement = document.querySelector(".as-product-compare-at-price");
			originalPriceElement.classList.remove("d-none");
			let currentPriceElement = document.querySelector(".as-product-price");
			let quantityInput = document.querySelector("input[name='quantity']"); // 获取加购数量输入框
			if (originalPriceElement && currentPriceElement && quantityInput) {
				let quantity = parseInt(quantityInput.value) || 1;
				let originalTotal = variantPrices[selectedVariant].original * quantity;
				let currentTotal = variantPrices[selectedVariant].current * quantity;
				originalPriceElement.innerText = `${originalTotal.toFixed(2)}`;
				currentPriceElement.innerText = `${currentTotal.toFixed(2)}`;
				let discount = originalTotal - currentTotal;
				discountElement.innerText = `${discount.toFixed(2)}`;
			}
		}
	}
	// **监听 Shopify & VWO 变体切换**
	function observeChanges() {
		let radioElements = document.querySelectorAll("input[name='Color'][type='radio'],input[name='Set'][type='radio']");
		let config = { attributes: true, attributeFilter: ['checked'] };
		let observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'checked') {
					const radio = mutation.target;
					if (radio.checked) {
						updatePriceStyle(false);
					}
				}
			}
		});
		radioElements.forEach((radio) => {
			observer.observe(radio, config);
		});
	}
	// **监听数量变化**
	function observeQuantityChange() {
		let quantityInput = document.querySelector("input[name='quantity']");
		if (quantityInput) {
			quantityInput.addEventListener("input", updatePriceStyle);
		}
	}
	// **初始化**
	document.addEventListener('DOMContentLoaded', ()=>{
		updatePriceStyle(true);
		observeChanges();
		observeQuantityChange();
	});
})()