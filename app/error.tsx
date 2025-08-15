'use client';

import React from 'react';
import { Alert, Button } from 'react-bootstrap';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-5">
      <Alert variant="danger">
        <Alert.Heading>Đã xảy ra lỗi!</Alert.Heading>
        <p>
          Rất tiếc, đã xảy ra lỗi khi tải trang này. Vui lòng thử lại.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button onClick={() => reset()} variant="outline-danger">
            Thử lại
          </Button>
        </div>
      </Alert>
    </div>
  );
}
