'use client'

import React, { FC, useCallback, useEffect, useState } from 'react'
import { Chip } from '@nextui-org/chip'
import { ClientReadableStream, RpcError } from 'grpc-web'
import { Icon } from '@iconify/react'
import { Spacer } from '@nextui-org/spacer'
import { Accordion, AccordionItem } from '@nextui-org/accordion'

import { useGeneralClient } from '@/components/client/metrics'
import { DetectURLRequest, DetectURLResponse } from '@/components/api/api_pb'

interface UrlDetectProps {
  url: string
}

enum Status {
  idle,
  loading,
  done,
}

export const UrlDetect: FC<UrlDetectProps> = ({ url }) => {
  const [status, setStatus] = useState<Status>(Status.idle)
  const [results, setResults] = useState<DetectURLResponse[]>([])
  const client = useGeneralClient()
  const [rpcError, setRpcError] = useState<RpcError | undefined>()

  const reset = useCallback(() => {
    setResults([])
    setStatus(Status.idle)
    setRpcError(undefined)
  }, [setRpcError, setStatus, setResults])

  useEffect(() => {
    reset()
    let stream: ClientReadableStream<DetectURLResponse>
    const t = setTimeout(() => {
      const req = new DetectURLRequest().setUrl(url)

      stream = client.detectURL(req)
      setStatus(Status.loading)
      // sleep for 1 second

      stream.on('data', response => {
        console.debug('on data', response)
        setResults(prev => [...prev, response])
      })
      stream.on('end', () => {
        setStatus(Status.done)
      })
      stream.on('error', rpcError => {
        console.debug('on error', rpcError)
        setRpcError(rpcError)
        setStatus(Status.done)
      })
    }, 200)

    return () => {
      stream && stream.cancel()
      clearTimeout(t)
    }
  }, [url, setResults])

  return (
    <div className={'flex flex-col gap-1'}>
      <Chip className={'text-default-500'} size={'sm'} variant={'light'}>
        {url}
      </Chip>

      <Spacer y={4} />
      <div className={'flex flex-col mx-2'}>
        {rpcError && (
          <div className="flex gap-1 items-center">
            <Icon color={'red'} icon="pajamas:error" />
            <div className="text-sm">{rpcError.message}</div>
          </div>
        )}
        <Accordion isCompact variant={'shadow'}>
          {results.map(r => (
            <AccordionItem
              key={r.getEndpoint()}
              isCompact
              aria-label={r.getEndpoint()}
              startContent={
                <AccordionIcon
                  error={r.getError()}
                  httpBody={r.getHttpresult()?.getBody()}
                  httpStatusCode={r.getHttpresult()?.getStatuscode()}
                  httpStatusText={r.getHttpresult()?.getStatustext()}
                />
              }
              title={r.getEndpoint()}
            >
              <Content error={r.getError()} httpBody={r.getHttpresult()?.getBody()} />
            </AccordionItem>
          ))}
        </Accordion>
        {status === Status.loading && <Icon className="self-center w-8 h-8" icon="line-md:loading-twotone-loop" />}
      </div>
      <div />
    </div>
  )
}

interface ContentProps {
  httpBody?: string
  error?: string
}

const Content: FC<ContentProps> = ({ httpBody, error }) => {
  if (httpBody || error) {
    return (
      <div className="w-full h-full">
        {httpBody && (
          <div
            dangerouslySetInnerHTML={{ __html: httpBody }}
            className="overflow-scroll max-h-[50vh] max-w-[80vw]"
            role="presentation"
            onClick={e => {
              // disable links
              e.preventDefault()
            }}
          />
        )}
        {error && <p>{error}</p>}
      </div>
    )
  } else {
    return null
  }
}

interface IndicatorProps {
  httpStatusCode?: number
  httpStatusText?: string
  httpBody?: string
  error?: string
}

export const AccordionIcon: FC<IndicatorProps> = ({ httpStatusCode, httpStatusText, error }) => {
  return (
    <div className="text-sm">
      {httpStatusCode && (
        <Chip
          className={'h-auto px-0 rounded-md'}
          color={httpStatusCode >= 200 && httpStatusCode < 399 ? 'success' : 'danger'}
          size={'sm'}
        >
          {httpStatusText ?? httpStatusCode}
        </Chip>
      )}
      {error && <Icon color={'red'} icon="pajamas:error" />}
    </div>
  )
}
