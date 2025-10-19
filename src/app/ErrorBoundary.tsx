import React, { Component, type ReactNode } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}
interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box p={10} textAlign="center">
          <Heading size="md" mb={4}>
            Something went wrong
          </Heading>
          <Text mb={4}>{this.state.message}</Text>
          <Button onClick={this.handleRetry} colorScheme="blue">
            Retry
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
