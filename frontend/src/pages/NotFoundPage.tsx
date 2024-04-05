import PageLayout from "../components/PageLayout";
import { Box, Heading } from "@chakra-ui/react";

export default function NotFoundPage() {
  return (
    <Box minH="80vh" display="flex" alignItems="center">
      <PageLayout>
        <Heading as="h3" size="lg" textAlign="center">
          Page not found.
        </Heading>
      </PageLayout>
    </Box>
  );
}
