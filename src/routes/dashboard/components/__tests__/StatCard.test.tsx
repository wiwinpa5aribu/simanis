/**
 * Tests untuk StatCard Component
 */

import { Package } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test/utils'
import { StatCard } from '../StatCard'

describe('StatCard Component', () => {
  it('should render title and value', () => {
    render(
      <StatCard
        title="Total Aset"
        value={150}
        icon={Package}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100"
      />
    )

    expect(screen.getByText('Total Aset')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('should render with string value', () => {
    render(
      <StatCard
        title="Status"
        value="Active"
        icon={Package}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
      />
    )

    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('should render with loading state', () => {
    render(
      <StatCard
        title="Loading"
        value="-"
        icon={Package}
        iconColor="text-gray-600"
        iconBgColor="bg-gray-100"
      />
    )

    expect(screen.getByText('-')).toBeInTheDocument()
  })

  it('should apply icon colors', () => {
    const { container } = render(
      <StatCard
        title="Test"
        value={100}
        icon={Package}
        iconColor="text-red-600"
        iconBgColor="bg-red-100"
      />
    )

    const iconContainer = container.querySelector('.bg-red-100')
    expect(iconContainer).toBeInTheDocument()
  })
})
