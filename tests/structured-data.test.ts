import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createPageStructuredData,
  createSiteStructuredData,
  structuredDataIds,
} from '../lib/structured-data.ts'

type SchemaNode = Record<string, unknown>

const findNode = (graph: SchemaNode[], type: string) =>
  graph.find((node) => node['@type'] === type)

test('site structured data connects WebSite, Organization and Person nodes', () => {
  const data = createSiteStructuredData()
  const graph = data['@graph'] as SchemaNode[]
  const website = findNode(graph, 'WebSite')
  const organization = findNode(graph, 'Organization')
  const person = findNode(graph, 'Person')

  assert.equal(data['@context'], 'https://schema.org')
  assert.equal(website?.['@id'], structuredDataIds.website)
  assert.equal(organization?.['@id'], structuredDataIds.organization)
  assert.equal(person?.['@id'], structuredDataIds.person)
  assert.equal(typeof organization?.telephone, 'string')
  assert.equal(typeof organization?.email, 'string')
  assert.doesNotMatch(String(organization?.telephone), /123[ -]?456/)
  assert.doesNotMatch(String(organization?.email), /example\.com/)
  assert.ok(Array.isArray(organization?.sameAs))
  assert.ok(JSON.stringify(organization).includes('OfferCatalog'))
})

test('page structured data contains an absolute URL and two breadcrumb items', () => {
  const data = createPageStructuredData({
    path: '/oferta',
    name: 'Oferta filmowa | Maleszyk Media',
    description: 'Opis oferty',
    breadcrumbName: 'Oferta',
    type: 'CollectionPage',
  })
  const graph = data['@graph'] as SchemaNode[]
  const page = findNode(graph, 'CollectionPage')
  const breadcrumbs = findNode(graph, 'BreadcrumbList')
  const items = breadcrumbs?.itemListElement as SchemaNode[]

  assert.match(String(page?.url), /^https:\/\/[^/]+\/oferta$/)
  assert.equal(items.length, 2)
  assert.equal(items[0].position, 1)
  assert.equal(items[1].position, 2)
  assert.equal(items[1].item, page?.url)
})
