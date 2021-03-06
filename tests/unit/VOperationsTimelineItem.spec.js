import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import toNow from 'date-fns/distance_in_words_to_now'
import VueTimeago from 'vue-timeago'
import VOperationsTimelineItem from '@/components/VOperationsTimelineItem'
import VOperationsTimelineItemDetail from '@/components/VOperationsTimelineItemDetail'
import socketFixture from './fixtures/socketServer'

const localVue = createLocalVue()
localVue.use(VueTimeago)

describe('VOperationsTimelineItem', () => {
  let props

  const build = () => {
    const options = {
      propsData: props,
      localVue,
    }

    const wrapper = shallowMount(VOperationsTimelineItem, options)
    const wrapperMounted = mount(VOperationsTimelineItem, options)

    return {
      wrapper,
      header: () => wrapper.find('.timeline-item__header'),
      content: () => wrapper.find('.timeline-item__content'),
      type: () => wrapper.find('.type'),
      date: () => wrapperMounted.find('.date'),
      detail: () => wrapper.find(VOperationsTimelineItemDetail),
    }
  }

  beforeEach(() => {
    props = {
      operation: {}
    }
  })

  it('renders the component correctly', () => {
    // arranje
    const { wrapper } = build()

    // assert
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders operation information', () => {
    // arranje
    props.operation = socketFixture.response.INSERT
    const { type, content, date, detail } = build()

    // assert
    expect(type().exists()).toBe(true)
    expect(type().text()).toContain(props.operation.type)

    expect(content().exists()).toBe(true)
    expect(content().text()).toContain(props.operation.schema)

    expect(content().exists()).toBe(true)
    expect(content().text()).toContain(props.operation.table)

    expect(date().exists()).toBe(true)
    expect(date().text()).toContain(toNow(props.operation.timestamp))

    expect(detail().isVisible()).toBe(false)
  })

  it('changes item class based on operation type', () => {
    // arranje
    props.operation = socketFixture.response.INSERT
    const { wrapper, header } = build()

    // assert INSERT
    expect(header().classes()).toContain('timeline-item__header--insert')
    expect(header().classes()).not.toContain('timeline-item__header--update')
    expect(header().classes()).not.toContain('timeline-item__header--delete')

    // assert UPDATE
    wrapper.setProps({
      operation: socketFixture.response.UPDATE,
    })
    expect(header().classes()).not.toContain('timeline-item__header--insert')
    expect(header().classes()).toContain('timeline-item__header--update')
    expect(header().classes()).not.toContain('timeline-item__header--delete')

    // assert DELETE
    wrapper.setProps({
      operation: socketFixture.response.DELETE,
    })
    expect(header().classes()).not.toContain('timeline-item__header--insert')
    expect(header().classes()).not.toContain('timeline-item__header--update')
    expect(header().classes()).toContain('timeline-item__header--delete')
  })

  it('shows opeartion details', () => {
    // arranje
    const { content, detail } = build()

    // act
    expect(detail().isVisible()).toBe(false)
    content().trigger('click')

    // assert
    expect(detail().isVisible()).toBe(true)
  })

  it('passes valid props to details component', () => {
    // arranje
    props.operation = socketFixture.response.INSERT
    const { detail } = build()

    // assert
    expect(detail().props().type).toBe(props.operation.type)
    expect(detail().props().rows).toBe(props.operation.affectedRows)
  })
})