<script lang="ts">
	import { Button } from './ui/button';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from './ui/dropdown-menu';
	import CheckCircleFillIcon from './icons/check-circle-fill.svelte';
	import ChevronDownIcon from './icons/chevron-down.svelte';
	import { cn } from '$lib/utils/shadcn';
	import type { ChatModel } from '$lib/ai/models';
	import type { ClassValue } from 'svelte/elements';
	import { SelectedModel } from '$lib/hooks/selected-model.svelte';
	import { page } from '$app/state';

	let {
		class: c
	}: {
		class: ClassValue;
	} = $props();

	let open = $state(false);
	const selectedChatModel = SelectedModel.fromContext();
	const availableChatModels = $derived((page.data.availableChatModels as ChatModel[]) ?? []);
	const selectedChatModelDetails = $derived(
		availableChatModels.find((model) => model.id === selectedChatModel.value)
	);
</script>

<DropdownMenu {open} onOpenChange={(val) => (open = val)}>
	<DropdownMenuTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class={cn(
					'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground w-fit md:h-[34px] md:px-2',
					c
				)}
			>
				{selectedChatModelDetails?.name}
				<ChevronDownIcon />
			</Button>
		{/snippet}
	</DropdownMenuTrigger>
	<DropdownMenuContent align="start" class="max-h-80 min-w-[300px] overflow-y-scroll">
		{#each availableChatModels as chatModel (chatModel.id)}
			<DropdownMenuItem
				onSelect={() => {
					open = false;
					selectedChatModel.value = chatModel.id;
				}}
				class="group/item flex flex-row items-center justify-between gap-4"
				data-active={chatModel.id === selectedChatModel.value}
			>
				<div class="flex flex-col items-start gap-1">
					<div>{chatModel.name}</div>
					<div class="text-muted-foreground text-xs">
						{chatModel.description}
					</div>
				</div>

				<div
					class="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100"
				>
					<CheckCircleFillIcon />
				</div>
			</DropdownMenuItem>
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
