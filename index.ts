import { LeboncoinSearchScraper } from './nodes/LeboncoinSearchScraper/LeboncoinSearchScraper.node';
import { ApifyApi } from './credentials/ApifyApi.credentials';

export const nodeTypes = [LeboncoinSearchScraper];

export const credentialTypes = [ApifyApi];
