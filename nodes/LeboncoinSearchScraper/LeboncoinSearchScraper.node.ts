import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import type { OptionField } from './GenericFunctions';
import { applyOptions, requireString, runActorAndGetItems } from './GenericFunctions';

// ScrapeUnblocker's public "Leboncoin Search Scraper" Actor: https://apify.com/scrapeunblocker/leboncoin-search-scraper
const ACTOR_ID = 'oPzXrv1fosmwldRD3';
const INTEGRATION_APP_ID = 'scrapeunblocker-leboncoin-search-scraper';

// Node option name -> Actor input key.
const OPTION_FIELDS: Record<string, OptionField> = {
	category: {
		key: 'category',
	},
	location: {
		key: 'location',
	},
	sort: {
		key: 'sort',
	},
	minPrice: {
		key: 'min_price',
	},
	maxPrice: {
		key: 'max_price',
	},
	page: {
		key: 'page',
	},
	includeSponsored: {
		key: 'include_sponsored',
	},
};

function buildActorInput(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
	options: IDataObject,
	itemIndex: number,
): IDataObject {
	const input: IDataObject = {};

	switch (`${resource}:${operation}`) {
		case 'listing:search': {
			input.query = requireString.call(this, 'query', 'Search Query', itemIndex);
			input.max_results = this.getNodeParameter('maxResults', itemIndex);
			break;
		}
		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not supported for resource "${resource}"`,
				{ itemIndex },
			);
	}

	applyOptions(input, options, OPTION_FIELDS);
	return input;
}

export class LeboncoinSearchScraper implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Leboncoin Search Scraper',
		name: 'leboncoinSearchScraper',
		icon: {
			light: 'file:leboncoinSearchScraper.png',
			dark: 'file:leboncoinSearchScraper.dark.png',
		},
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Search Leboncoin classified ads in France with the ScrapeUnblocker Actor on Apify',
		defaults: {
			name: 'Leboncoin Search Scraper',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'apifyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Listing',
						value: 'listing',
					},
				],
				default: 'listing',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['listing'],
					},
				},
				options: [
					{
						name: 'Search',
						value: 'search',
						description: 'Search Leboncoin ads by keyword',
						action: 'Search listings',
					},
				],
				default: 'search',
			},
			{
				displayName: 'Search Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'velo electrique',
				description: "What to search for, e.g. 'velo electrique' or 'iphone 13'",
				displayOptions: {
					show: {
						resource: ['listing'],
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Max Results',
				name: 'maxResults',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 500,
				},
				default: 35,
				description: 'How many listings to collect across pages (35 per page, up to 500)',
				displayOptions: {
					show: {
						resource: ['listing'],
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Category',
						name: 'category',
						type: 'options',
						options: [
							{
								name: 'Animals',
								value: 'animals',
							},
							{
								name: 'Antiques',
								value: 'antiques',
							},
							{
								name: 'Any',
								value: '',
							},
							{
								name: 'Appliances',
								value: 'appliances',
							},
							{
								name: 'Baby Equipment',
								value: 'baby_equipment',
							},
							{
								name: 'Bags and Accessories',
								value: 'bags_accessories',
							},
							{
								name: 'Bikes',
								value: 'bikes',
							},
							{
								name: 'Books',
								value: 'books',
							},
							{
								name: 'Car Parts',
								value: 'car_parts',
							},
							{
								name: 'Cars',
								value: 'cars',
							},
							{
								name: 'Clothing',
								value: 'clothing',
							},
							{
								name: 'Collectibles',
								value: 'collectibles',
							},
							{
								name: 'Commercial Property',
								value: 'commercial_property',
							},
							{
								name: 'Computer Accessories',
								value: 'computer_accessories',
							},
							{
								name: 'Computers',
								value: 'computers',
							},
							{
								name: 'Consoles',
								value: 'consoles',
							},
							{
								name: 'Decoration',
								value: 'decoration',
							},
							{
								name: 'DIY',
								value: 'diy',
							},
							{
								name: 'Electronics (All)',
								value: 'electronics',
							},
							{
								name: 'Fashion (All)',
								value: 'fashion',
							},
							{
								name: 'Flatshare',
								value: 'flatshare',
							},
							{
								name: 'Furniture',
								value: 'furniture',
							},
							{
								name: 'Garden',
								value: 'garden',
							},
							{
								name: 'Holiday Rentals',
								value: 'holiday_rentals',
							},
							{
								name: 'Home and Garden (All)',
								value: 'home_garden',
							},
							{
								name: 'Job Offers',
								value: 'job_offers',
							},
							{
								name: 'Jobs',
								value: 'jobs',
							},
							{
								name: 'Leisure (All)',
								value: 'leisure',
							},
							{
								name: 'Motorcycles',
								value: 'motorcycles',
							},
							{
								name: 'Music Instruments',
								value: 'music_instruments',
							},
							{
								name: 'Phones',
								value: 'phones',
							},
							{
								name: 'Photo, Audio and Video',
								value: 'photo_audio_video',
							},
							{
								name: 'Real Estate (All)',
								value: 'real_estate',
							},
							{
								name: 'Real Estate for Sale',
								value: 'real_estate_sale',
							},
							{
								name: 'Rentals',
								value: 'rentals',
							},
							{
								name: 'Shoes',
								value: 'shoes',
							},
							{
								name: 'Sports',
								value: 'sports',
							},
							{
								name: 'Toys',
								value: 'toys',
							},
							{
								name: 'Vans',
								value: 'vans',
							},
							{
								name: 'Vehicles (All)',
								value: 'vehicles',
							},
							{
								name: 'Video Games',
								value: 'video_games',
							},
							{
								name: 'Watches and Jewelry',
								value: 'watches_jewelry',
							},
						],
						default: '',
						description: 'Only listings in this Leboncoin category',
					},
					{
						displayName: 'Include Sponsored',
						name: 'includeSponsored',
						type: 'boolean',
						default: false,
						description:
							"Whether to also return Leboncoin's paid 'à la une' placements (marked sponsored). Off by default: Leboncoin shows the same few on every page regardless of the query, category and sort.",
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						placeholder: 'Bordeaux',
						description:
							"Where to search: a city ('Bordeaux'), a city with postcode ('Toulouse 31000'), a department code ('75') or a region ('Ile-de-France')",
					},
					{
						displayName: 'Max Price (EUR)',
						name: 'maxPrice',
						type: 'number',
						typeOptions: {
							minValue: 0,
						},
						default: 500,
						description: 'Highest price to include, in EUR',
					},
					{
						displayName: 'Min Price (EUR)',
						name: 'minPrice',
						type: 'number',
						typeOptions: {
							minValue: 0,
						},
						default: 0,
						description: 'Lowest price to include, in EUR',
					},
					{
						displayName: 'Sort By',
						name: 'sort',
						type: 'options',
						options: [
							{
								name: 'Newest First',
								value: 'newest',
							},
							{
								name: 'Price: high to low',
								value: 'price_high',
							},
							{
								name: 'Price: low to high',
								value: 'price_low',
							},
							{
								name: 'Relevance',
								value: 'relevance',
							},
						],
						default: 'relevance',
						description: 'Result ordering',
					},
					{
						displayName: 'Start Page',
						name: 'page',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 1,
						description: 'Results page to start from (1 is the first page)',
					},
					{
						displayName: 'Timeout (Seconds)',
						name: 'timeout',
						type: 'number',
						typeOptions: {
							minValue: 0,
						},
						default: 0,
						description:
							'Maximum run time of the Apify Actor run. 0 keeps the Actor default. A run that times out fails the node.',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const options = this.getNodeParameter('options', i, {}) as IDataObject;
				const { timeout, ...actorOptions } = options;

				const input = buildActorInput.call(this, resource, operation, actorOptions, i);
				const { items: results } = await runActorAndGetItems.call(this, {
					actorId: ACTOR_ID,
					integrationAppId: INTEGRATION_APP_ID,
					input,
					itemIndex: i,
					timeoutSecs: (timeout as number) || undefined,
				});

				for (const result of results) {
					returnData.push({ json: result, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				// Both constructors return an error of their own class unchanged.
				if (error instanceof NodeApiError) {
					throw new NodeApiError(this.getNode(), error as unknown as JsonObject, { itemIndex: i });
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
