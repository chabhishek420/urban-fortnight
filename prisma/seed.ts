/**
 * Test Data Seeder
 * 
 * Creates sample data for testing the tracker.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test data...');

  // Create a test domain
  const domain = await prisma.domain.upsert({
    where: { name: 'tracker.test' },
    update: {},
    create: {
      name: 'tracker.test',
      isSsl: false,
      state: 'active',
      catchNotFound: true,
      wildcard: false,
    }
  });
  console.log(`✅ Created domain: ${domain.name}`);

  // Create a traffic source
  const trafficSource = await prisma.trafficSource.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Test Traffic Source',
      postbackUrl: 'https://example.com/postback',
      state: 'active',
    }
  });
  console.log(`✅ Created traffic source: ${trafficSource.name}`);

  // Create an affiliate network
  const affiliateNetwork = await prisma.affiliateNetwork.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Test Affiliate Network',
      postbackUrl: 'https://affiliate.example.com/postback',
      state: 'active',
    }
  });
  console.log(`✅ Created affiliate network: ${affiliateNetwork.name}`);

  // Create an offer
  const offer = await prisma.offer.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Test Offer',
      actionPayload: 'https://offer.example.com/?subid={clickid}',
      affiliateNetworkId: affiliateNetwork.id,
      payoutValue: 10.0,
      payoutCurrency: 'USD',
      payoutType: 'CPA',
      state: 'active',
      url: 'https://offer.example.com/',
    }
  });
  console.log(`✅ Created offer: ${offer.name}`);

  // Create a landing page
  const landing = await prisma.landing.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Test Landing Page',
      actionPayload: 'https://landing.example.com/',
      offerCount: 1,
      state: 'active',
      landingType: 'external',
      url: 'https://landing.example.com/',
    }
  });
  console.log(`✅ Created landing: ${landing.name}`);

  // Create a campaign
  const campaign = await prisma.campaign.upsert({
    where: { id: 1 },
    update: {},
    create: {
      alias: 'test-campaign',
      name: 'Test Campaign',
      type: 'position',
      state: 'active',
      actionType: 'http_redirect',
      domainId: domain.id,
      trafficSourceId: trafficSource.id,
      costType: 'CPC',
      costValue: 0.01,
      token: 'test-token-123',
    }
  });
  console.log(`✅ Created campaign: ${campaign.name} (alias: ${campaign.alias})`);

  // Create a stream for the campaign
  const stream = await prisma.stream.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Main Stream',
      campaignId: campaign.id,
      type: 'regular',
      state: 'active',
      actionType: 'http_redirect',
      actionPayload: 'https://offer.example.com/?subid={clickid}',
      collectClicks: true,
      position: 1,
    }
  });
  console.log(`✅ Created stream: ${stream.name}`);

  // Create stream-offer association
  const streamOffer = await prisma.streamOfferAssociation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      streamId: stream.id,
      offerId: offer.id,
      state: 'active',
      share: 100,
    }
  });
  console.log(`✅ Created stream-offer association`);

  // Create a settings entry
  await prisma.setting.upsert({
    where: { key: 'disable_stats' },
    update: { value: '0' },
    create: {
      key: 'disable_stats',
      value: '0',
    }
  });
  console.log(`✅ Created settings`);

  console.log('\n🎉 Seeding complete!');
  console.log('\nTest URLs:');
  console.log(`  Campaign: http://tracker.test/${campaign.alias}`);
  console.log(`  Click ID param: ?subid=test123`);
  console.log(`  Sub ID params: ?sub_id_1=value1&sub_id_2=value2`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
