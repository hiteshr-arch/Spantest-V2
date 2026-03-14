interface JiraTicket {
  key: string
  type: 'Story' | 'Bug' | 'Task'
  title: string
  priority: 'Low' | 'Medium' | 'High'
}

const MOCK_TICKETS: JiraTicket[] = [
  {
    key: 'EC-201',
    type: 'Story',
    title: 'User can apply discount coupon at checkout',
    priority: 'High',
  },
  {
    key: 'EC-202',
    type: 'Story',
    title: 'Guest users see upsell modal after adding 3+ items',
    priority: 'Medium',
  },
  {
    key: 'EC-203',
    type: 'Bug',
    title: 'Payment failure should show retry option',
    priority: 'High',
  },
  {
    key: 'EC-204',
    type: 'Task',
    title: 'Product images load lazily on scroll',
    priority: 'Low',
  },
  {
    key: 'EC-205',
    type: 'Story',
    title: 'Order confirmation email includes itemised receipt',
    priority: 'Medium',
  },
]

export async function listJiraTickets(): Promise<JiraTicket[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return MOCK_TICKETS
}

export async function getTicketStory(key: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const map: Record<string, string> = {
    'EC-201':
      'As a user, I want to apply a discount coupon at checkout so that I can get a reduced price on my order.',
    'EC-202':
      'As a guest user, I want to see an upsell modal after adding 3+ items so that I can discover related products.',
    'EC-203':
      'As a user, when payment fails I want to see a retry option so that I can complete my purchase.',
    'EC-204':
      'As a user, product images should load lazily on scroll so that the page loads faster.',
    'EC-205':
      'As a user, I want to receive an order confirmation email with an itemised receipt after checkout.',
  }

  return map[key] ?? ''
}

