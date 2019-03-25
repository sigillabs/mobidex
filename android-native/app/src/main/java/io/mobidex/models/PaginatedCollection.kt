package io.mobidex.models

data class PaginatedCollection<T>(val page: Int, val perPage: Int, val records: List<T>)