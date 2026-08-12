import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  }

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-fallback">
          <h2>Something went wrong</h2>

          <p>Please try again.</p>

          <button
            id="error-retry"
            type="button"
            onClick={this.handleRetry}
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}